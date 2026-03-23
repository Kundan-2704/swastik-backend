function otpTemplate({ name, otp }) {

return `

<div style="margin:0;padding:0;background:#f6f1eb;font-family:Helvetica,Arial,sans-serif">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0">

<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="
background:white;
border-radius:14px;
padding:40px;
box-shadow:0 5px 25px rgba(0,0,0,0.05)
">

<!-- LOGO -->
<tr>
<td align="center">

<h2 style="
margin:0;
font-weight:600;
letter-spacing:1px;
color:#4b3a2f;
font-size:26px
">

Swastik

</h2>

<p style="
margin-top:4px;
font-size:12px;
letter-spacing:3px;
color:#b08d57
">

HERITAGE WOVEN LUXURY

</p>

</td>
</tr>

<!-- TITLE -->
<tr>
<td style="padding-top:30px">

<p style="font-size:16px;color:#4b3a2f">
Hello ${name},
</p>

<p style="font-size:15px;color:#6b5b4d">

Use the OTP below to securely login to your account.

</p>

</td>
</tr>

<!-- OTP BOX -->
<tr>
<td align="center" style="padding:30px 0">

<div style="
font-size:34px;
font-weight:600;
letter-spacing:8px;
background:#f3ede6;
color:#3e2f25;
padding:18px;
border-radius:10px;
display:inline-block;
min-width:220px
">

${otp}

</div>

</td>
</tr>

<!-- INFO -->
<tr>
<td>

<p style="
font-size:14px;
color:#6b5b4d;
line-height:1.6
">

This OTP is valid for <b>5 minutes</b>.

</p>

<p style="
font-size:13px;
color:#8c7a6b
">

For security reasons, do not share this OTP with anyone.

</p>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="padding-top:25px">

<hr style="border:none;border-top:1px solid #eee">

<p style="
font-size:12px;
color:#b5a79a;
text-align:center;
margin-top:20px
">

© ${new Date().getFullYear()} Swastik Handloom  
Crafted with tradition 🧵

</p>

</td>
</tr>

</table>

</td>
</tr>

</table>

</div>

`;

}

module.exports = otpTemplate;