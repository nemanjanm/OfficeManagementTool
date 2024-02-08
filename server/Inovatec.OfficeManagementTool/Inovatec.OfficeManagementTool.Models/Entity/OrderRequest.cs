﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable disable
using System;
using System.Collections.Generic;

namespace Inovatec.OfficeManagementTool.Models.Entity
{
    public partial class OrderRequest
    {
        public long Id { get; set; }
        public long ItemId { get; set; }
        public int Amount { get; set; }
        public long OfficeId { get; set; }
        public bool InOrder { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public long UserId { get; set; }

        public virtual Item Item { get; set; }
        public virtual Office Office { get; set; }
        public virtual User User { get; set; }
    }
}