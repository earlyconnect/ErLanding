using System;
using System.Configuration;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Web.Http;
using EarlyConnect.Models;

namespace EarlyConnect.Controllers
{
    [RoutePrefix("api/demo")]
    public class DemoController : ApiController
    {
        [HttpPost]
        [Route("book")]
        public IHttpActionResult BookDemo([FromBody] DemoRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.WorkEmail))
            {
                return BadRequest("Invalid request payload.");
            }

            try
            {
                SendEmailNotification(request);
                return Ok(new { success = true, message = "Demo request successfully sent." });
            }
            catch (Exception ex)
            {
                // Log exception using your logger (e.g., log4net, NLog)
                return InternalServerError(ex);
            }
        }

        private void SendEmailNotification(DemoRequest model)
        {
            var fromAddress = new MailAddress("no-reply@earlyconnect.com", "EarlyConnect Web Form");
            var toAddress = new MailAddress("support@earlyconnect.com", "EarlyConnect Support");

            // Format dynamic body details depending on selected platform
            StringBuilder dynamicFieldsHtml = new StringBuilder();

            switch (model.ServiceSelect?.ToLower())
            {
                case "earlyrepair":
                    dynamicFieldsHtml.Append($"<p><b>Technician Count:</b> {model.TechsCount}</p>");
                    dynamicFieldsHtml.Append($"<p><b>Current FSM Software:</b> {model.FsmSoftware ?? "N/A"}</p>");
                    break;
                case "earlysms":
                    dynamicFieldsHtml.Append($"<p><b>Monthly SMS Volume:</b> {model.SmsVolume}</p>");
                    dynamicFieldsHtml.Append($"<p><b>Primary SMS Goal:</b> {model.PrimarySmsGoal ?? "N/A"}</p>");
                    break;
                case "earlytms":
                    dynamicFieldsHtml.Append($"<p><b>Agent Count:</b> {model.AgentCount}</p>");
                    dynamicFieldsHtml.Append($"<p><b>Current CRM:</b> {model.CrmIntegration ?? "N/A"}</p>");
                    break;
            }

            string body = $@"
                <h2>New Demo Request: {model.ServiceSelect?.ToUpper()}</h2>
                <hr />
                <h3>Contact Information</h3>
                <p><b>Name:</b> {model.FullName}</p>
                <p><b>Email:</b> {model.WorkEmail}</p>
                <p><b>Phone:</b> {model.Phone}</p>
                <p><b>Company:</b> {model.CompanyName}</p>
                
                <h3>Platform Specific Details</h3>
                {dynamicFieldsHtml}
                
                <h3>Additional Notes</h3>
                <p>{model.Notes ?? "None provided."}</p>";

            using (var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = $"[New Lead] Demo Request for {model.ServiceSelect?.ToUpper()} - {model.CompanyName}",
                Body = body,
                IsBodyHtml = true
            })
            {
                // Set Reply-To so support can hit 'Reply' and reach the prospect directly
                message.ReplyToList.Add(new MailAddress(model.WorkEmail, model.FullName));

                using (var smtp = new SmtpClient())
                {
                    // Pulls SMTP settings directly from Web.config
                    smtp.Send(message);
                }
            }
        }
    }
}