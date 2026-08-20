using System;

namespace EarlyConnect.Models
{
    public class DemoRequest
    {
        public string FullName { get; set; }
        public string WorkEmail { get; set; }
        public string Phone { get; set; }
        public string CompanyName { get; set; }
        public string ServiceSelect { get; set; }
        
        // EarlyRepair Specific Fields
        public string TechsCount { get; set; }
        public string FsmSoftware { get; set; }
        
        // EarlySMS Specific Fields
        public string SmsVolume { get; set; }
        public string PrimarySmsGoal { get; set; }
        
        // EarlyTMS Specific Fields
        public string AgentCount { get; set; }
        public string CrmIntegration { get; set; }
        
        public string Notes { get; set; }
    }
}