<?php
namespace Neon;

enum Rate: string
{
    case Hourly = 'hourly';
    case Monthly = 'monthly';
    case Weekly = 'weekly';
    case Yearly = 'yearly';
}
