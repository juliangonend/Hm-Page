<?php

declare(strict_types=1);

namespace HmApi\Application;

enum LoginResult
{
    case Success;
    case InvalidCredentials;
    case TooManyAttempts;
}
