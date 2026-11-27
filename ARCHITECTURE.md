# Workspace architecture and service boundaries

The workspace contains four separately deployed sites. Sharing infrastructure
does not make their application behavior interchangeable.

| Site | Owns | Runtime boundary |
| --- | --- | --- |
| `minescout.net` | Studio pages, public forms, client-facing content | Static site; submits forms to the Life mail relay |
| `beta.minescout.net` | Beta inquiries and feature requests | Static site; submits forms to the Life mail relay; Firebase archive is best-effort |
| `life.minescout.net` | Life app, admin/session behavior, MCP server, mail relay | Server-backed app; owns the shared static-site mail ingress |
| `chop-lab.com` | Product catalog, configurator, order workflow, invoice/outbox | Server-backed app; sends its own order mail because requests include attachments |

## Shared infrastructure

- The root `.env.example` documents shared local configuration. The real root
  `.env` is ignored and must never be committed.
- Life and Chop Lab read SMTP credentials from environment variables. Locally
  each loader also reads a `.env` in every site folder, so the SMTP account is
  found whichever folder holds it; the app's own file wins. Production
  deployments inject secrets separately into each service.
- The root GitHub Actions workflow coordinates checks; each site keeps its
  own install, build, tests, and runtime-specific checks.
- Shared infrastructure must not become an implicit shared application
  runtime. A change to one site's route, data model, authentication, or email
  behavior must not silently change another site's behavior.

## Email service boundary

### Static-site forms → Life relay

`life.minescout.net/server/mail.js` owns the allowlisted form names, recipient
selection, templates, validation, rate limits, and SMTP send for the three
browser-only sites. The browser sends a form identifier and fields; it never
chooses a recipient or receives SMTP credentials. Keep form-specific templates
and routing rules in this relay.

### Chop Lab orders → in-process SMTP

`chop-lab.com/src/lib/studio-mail.ts` owns Chop Lab's server-side SMTP send.
The configurator sends a customer receipt and a studio notification; only the
studio copy carries uploaded design files. `src/lib/requests.ts` and
`src/routes/outbox.tsx` own the browser-local retry queue and its attachment
retention rules. Do not route these attachments through the static-site relay
or introduce a silent fallback transport.

## Boundary rules for changes

1. Keep each site's product logic, route handlers, data contracts, and UI
   inside that site's directory.
2. A shared service must expose an explicit, validated contract. Do not import
   another site's private `src/` modules to reuse a helper.
3. Keep recipient selection and credentials server-side. Never accept an
   arbitrary email destination or SMTP secret from a browser request.
4. Share only stable cross-site primitives. If a behavior becomes genuinely
   common, extract it behind a documented package or service contract with
   tests; do not couple sites by copying hidden implementation details.
5. Keep CI jobs site-scoped even when they share one workflow file. A site's
   dependency, build, or test change should be attributable to that site.

For operational email checks and attachment verification, follow
[EMAIL-SETUP.md](EMAIL-SETUP.md#ongoing-delivery-checks).
