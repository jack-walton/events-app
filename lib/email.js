export function magicLinkEmail(url) {
  const subject = "Your VENU sign-in link";
  const text = [
    "Sign in to VENU with this link:",
    url,
    "",
    "The link expires in 15 minutes. If you did not ask for this, you can ignore the email."
  ].join("\n");

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 20px;background:#f5f4f2;font-family:Arial,Helvetica,sans-serif;color:#161513;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #d4d1cc;">
      <tr>
        <td style="padding:28px 28px 8px;letter-spacing:0.14em;font-size:13px;font-weight:700;">VENU</td>
      </tr>
      <tr>
        <td style="padding:8px 28px 0;font-size:24px;line-height:1.3;font-weight:700;">Sign in to VENU</td>
      </tr>
      <tr>
        <td style="padding:12px 28px 24px;font-size:16px;line-height:1.5;">
          Use this link to open your account. It expires in 15 minutes.
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 28px;">
          <a href="${url}" style="display:inline-block;background:#c74634;color:#ffffff;text-decoration:none;padding:12px 18px;font-weight:700;">Open VENU</a>
        </td>
      </tr>
      <tr>
        <td style="padding:0 28px 28px;font-size:13px;line-height:1.5;color:#5f5b57;">
          If you did not ask for this, ignore the email. Nothing will change.
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
}
