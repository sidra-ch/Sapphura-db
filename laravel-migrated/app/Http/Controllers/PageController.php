<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

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
}
