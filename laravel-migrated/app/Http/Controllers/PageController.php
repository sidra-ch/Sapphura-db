<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PageController extends Controller
{
    public function about() { return view('pages.about'); }
    public function contact() { return view('pages.contact'); }
    public function faq() { return view('pages.faq'); }
    public function blogs() { return view('pages.blogs'); }
    public function trackOrder() { return view('pages.track-order'); }
    public function howToOrder() { return view('pages.how-to-order'); }
    public function shippingRates() { return view('pages.shipping-rates'); }
    public function termsOfService() { return view('pages.terms-of-service'); }
    public function refundPolicy() { return view('pages.refund-policy'); }
    public function exchangePolicy() { return view('pages.exchange-policy'); }
    public function stitching() { return view('pages.stitching'); }

    public function stitchingRequest(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['required', 'string', 'max:40'],
            'contact_method' => ['nullable', 'in:whatsapp,phone,email'],
            'garment_type' => ['required', 'string', 'max:80'],
            'design_details' => ['nullable', 'string', 'max:5000'],
            'timeline' => ['nullable', 'in:urgent,standard,flexible'],
        ]);

        Log::info('stitching_request_submitted', [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'contact_method' => $data['contact_method'] ?? 'whatsapp',
            'garment_type' => $data['garment_type'],
            'timeline' => $data['timeline'] ?? null,
        ]);

        return redirect()
            ->route('stitching')
            ->with('stitching_success', 'Thanks! Your stitching request is received. Our team will contact you within 24 hours.');
    }
}
