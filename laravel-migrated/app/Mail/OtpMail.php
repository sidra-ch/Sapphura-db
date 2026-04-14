<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $otp;
    public string $customerName;

    public function __construct(string $otp, string $customerName)
    {
        $this->otp = $otp;
        $this->customerName = $customerName;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Sapphura Verification Code',
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.otp',
        );
    }
}
