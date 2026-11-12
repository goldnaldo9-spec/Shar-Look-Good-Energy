# Trimhaus Barbing Salon — outcomes

## Professional salon homepage
- The site presents a polished, mobile-friendly barbing salon homepage with clear hierarchy, a hero section, services, booking CTA, and contact information.
- The page uses the working brand name Trimhaus and a coherent barbershop visual system.

## Services and booking
- Customers can view service names, prices, and short descriptions.
- Customers can select a service, enter their name/email/phone, choose a date and time, and submit an appointment request.
- The primary booking CTA is visible in the hero and the booking section.

## Contact details
- The site shows email `goldnaldo9@gmail.com`.
- The site shows phone `+421 915 189 681`.
- The site shows address `Budatínska 23, Bratislava`.
- Contact links use `mailto:` and `tel:` targets where appropriate.

## Payment option
- The booking flow includes a clear €10 deposit payment option.
- The app sends booking details to the server checkout route and redirects to Stripe Checkout when configured.
- The site never stores card numbers, expiry dates, or security codes.
- When live payment setup is not complete, the UI communicates that the payment option is in setup/test mode instead of implying a live transaction.

## Technical delivery
- The app serves `GET /manus-routes.json` with the declared `/` and `/404` routes.
- The project passes TypeScript checks and the production build.
- The configured Stripe integration remains enabled for test checkout and later owner claim/live-key setup.
