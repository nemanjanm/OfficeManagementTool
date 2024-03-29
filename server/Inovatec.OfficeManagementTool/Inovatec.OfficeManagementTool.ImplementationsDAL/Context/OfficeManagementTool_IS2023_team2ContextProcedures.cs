﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
using Inovatec.OfficeManagementTool.Models.Entity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading;
using System.Threading.Tasks;

namespace Inovatec.OfficeManagementTool.ImplementationsDAL.Context
{
    public partial class OfficeManagementTool_IS2023_team2Context
    {
        private IOfficeManagementTool_IS2023_team2ContextProcedures _procedures;

        public virtual IOfficeManagementTool_IS2023_team2ContextProcedures Procedures
        {
            get
            {
                if (_procedures is null) _procedures = new OfficeManagementTool_IS2023_team2ContextProcedures(this);
                return _procedures;
            }
            set
            {
                _procedures = value;
            }
        }

        public IOfficeManagementTool_IS2023_team2ContextProcedures GetProcedures()
        {
            return Procedures;
        }

        protected void OnModelCreatingGeneratedProcedures(ModelBuilder modelBuilder)
        {
        }
    }

    public partial class OfficeManagementTool_IS2023_team2ContextProcedures : IOfficeManagementTool_IS2023_team2ContextProcedures
    {
        private readonly OfficeManagementTool_IS2023_team2Context _context;

        public OfficeManagementTool_IS2023_team2ContextProcedures(OfficeManagementTool_IS2023_team2Context context)
        {
            _context = context;
        }

        public virtual async Task<int> CreateOrderAsync(long? officeId, OutputParameter<int> returnValue = null, CancellationToken cancellationToken = default)
        {
            var parameterreturnValue = new SqlParameter
            {
                ParameterName = "returnValue",
                Direction = System.Data.ParameterDirection.Output,
                SqlDbType = System.Data.SqlDbType.Int,
            };

            var sqlParameters = new []
            {
                new SqlParameter
                {
                    ParameterName = "officeId",
                    Value = officeId ?? Convert.DBNull,
                    SqlDbType = System.Data.SqlDbType.BigInt,
                },
                parameterreturnValue,
            };
            var _ = await _context.Database.ExecuteSqlRawAsync("EXEC @returnValue = [dbo].[CreateOrder] @officeId", sqlParameters, cancellationToken);

            returnValue?.SetValue(parameterreturnValue.Value);

            return _;
        }
    }
}
