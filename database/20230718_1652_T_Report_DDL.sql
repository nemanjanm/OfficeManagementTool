IF (NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND  TABLE_Name = 'Report'))
BEGIN
	CREATE TABLE [dbo].[Report](
		[Id] [bigint] IDENTITY(1,1) NOT NULL,
		[OfficeId] [bigint] NOT NULL,
		[UserId] [bigint] NOT NULL,
		[Description] [varchar](255) NOT NULL,
		[State] [int] NOT NULL,
		[EquipmentId] [bigint] NOT NULL,
		[Category] [int] NOT NULL,
		[IsDeleted] [bit] NOT NULL CONSTRAINT [DF_User_IsDeleted] DEFAULT 0,
		[DateCreated] [datetime] NOT NULL,
		[DateModified] [datetime] NOT NULL,
		[LastModifiedBy] [bigint] NOT NULL,
		CONSTRAINT [PK_Report] PRIMARY KEY CLUSTERED 
		(
			   [Id] ASC
		) WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY],
		CONSTRAINT [FK_Report_OfficeId] FOREIGN KEY ([OfficeId]) REFERENCES [dbo].[Office](Id),
		CONSTRAINT [FK_Report_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User](Id)
	);
END