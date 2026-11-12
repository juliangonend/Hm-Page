<?php

declare(strict_types=1);

namespace HmApi\Tests;

use HmApi\Domain\ValidationException;
use HmApi\Infrastructure\GdImageStorage;
use PHPUnit\Framework\TestCase;

final class GdImageStorageTest extends TestCase
{
    private string $dir;
    private GdImageStorage $storage;

    protected function setUp(): void
    {
        $this->dir = sys_get_temp_dir() . '/hm-uploads-' . bin2hex(random_bytes(4));
        $this->storage = new GdImageStorage($this->dir, maxBytes: 3 * 1024 * 1024, maxWidth: 800);
    }

    protected function tearDown(): void
    {
        foreach (glob($this->dir . '/{,.}*', GLOB_BRACE) ?: [] as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
        @rmdir($this->dir);
    }

    private function pngFile(int $width, int $height): string
    {
        $img = imagecreatetruecolor($width, $height);
        $path = tempnam(sys_get_temp_dir(), 'png');
        imagepng($img, $path);

        return $path;
    }

    public function testStoresAnUploadAsAResizedWebpAndProtectsTheFolder(): void
    {
        $name = $this->storage->store($this->pngFile(1600, 900), 'event-7');

        self::assertMatchesRegularExpression('/^event-7-[a-f0-9]{12}\.webp$/', $name);
        [$width, $height, $type] = getimagesize($this->dir . '/' . $name);
        self::assertSame(IMAGETYPE_WEBP, $type);
        self::assertSame(800, $width);
        self::assertSame(450, $height);
        self::assertFileExists($this->dir . '/.htaccess');
    }

    public function testKeepsSmallImagesAtTheirSize(): void
    {
        $name = $this->storage->store($this->pngFile(400, 300), 'event-1');
        self::assertSame(400, getimagesize($this->dir . '/' . $name)[0]);
    }

    public function testRejectsFilesThatAreNotImages(): void
    {
        $fake = tempnam(sys_get_temp_dir(), 'php');
        file_put_contents($fake, '<?php echo "hacked";');

        $this->expectException(ValidationException::class);
        $this->storage->store($fake, 'event-1');
    }

    public function testRejectsFilesOverTheSizeLimit(): void
    {
        $storage = new GdImageStorage($this->dir, maxBytes: 10, maxWidth: 800);
        $this->expectException(ValidationException::class);
        $storage->store($this->pngFile(50, 50), 'event-1');
    }

    public function testDeletesAStoredImageAndIgnoresPathTraversal(): void
    {
        $name = $this->storage->store($this->pngFile(10, 10), 'event-1');
        $this->storage->delete($name);
        self::assertFileDoesNotExist($this->dir . '/' . $name);

        $outside = tempnam(sys_get_temp_dir(), 'keep');
        $this->storage->delete('../' . basename($outside));
        self::assertFileExists($outside);
        unlink($outside);
    }
}
