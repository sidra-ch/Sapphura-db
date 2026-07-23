<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $customerName;
    public string $resetUrl;

    public function __construct(string $customerName, string $resetUrl)
    {
        $this->customerName = $customerName;
        $this->resetUrl = $resetUrl;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset Your Sapphura Password',
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.password-reset',
        );
    }
}
