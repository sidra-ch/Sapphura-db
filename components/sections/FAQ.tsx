"use client";
import * as Accordion from '@radix-ui/react-accordion';

const faqs = [
	{
		question: 'What makes Sapphura luxury unique?',
		answer: 'Our collections are curated for elegance, using premium materials and exclusive designs.'
	},
	{
		question: 'How can I contact Sapphura?',
		answer: 'You can reach us via WhatsApp, Instagram, TikTok, Facebook, or our contact page.'
	},
	{
		question: 'Do you ship internationally?',
		answer: 'Yes, Sapphura offers worldwide shipping with secure payment options.'
	}
];

export default function FAQ() {
	return (
		<section className="py-16 px-4 md:px-16 bg-[#1a1a40]">
			<h2 className="text-3xl md:text-5xl font-bold text-gold mb-10 text-center">Frequently Asked Questions</h2>
			<Accordion.Root type="single" collapsible className="w-full max-w-2xl mx-auto">
				{faqs.map((faq, idx) => (
					<Accordion.Item key={idx} value={`faq-${idx}`} className="mb-4 border border-gold rounded-lg bg-[#0a0a23]">
						<Accordion.Header>
							<Accordion.Trigger className="w-full px-6 py-4 text-lg font-semibold text-gold hover:bg-gold hover:text-[#0a0a23] transition rounded-t-lg shadcn-button">
								{faq.question}
							</Accordion.Trigger>
						</Accordion.Header>
						<Accordion.Content className="px-6 py-4 text-white/80 bg-[#1a1a40] rounded-b-lg">
							{faq.answer}
						</Accordion.Content>
					</Accordion.Item>
				))}
			</Accordion.Root>
		</section>
	);
}
