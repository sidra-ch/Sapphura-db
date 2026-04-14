<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $orderId;
    public string $customerName;
    public float $total;
    public array $items;
    public string $shippingAddress;

    public function __construct(string $orderId, string $customerName, float $total, array $items, string $shippingAddress)
    {
        $this->orderId = $orderId;
        $this->customerName = $customerName;
        $this->total = $total;
        $this->items = $items;
        $this->shippingAddress = $shippingAddress;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Sapphura Order Confirmation #{$this->orderId}",
        );
    }

    public function content(): Content
    {
        return new Content(
            html: 'emails.order-confirmation',
        );
    }
}
