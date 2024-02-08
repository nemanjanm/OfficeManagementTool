IF (NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND  TABLE_Name = 'Scheduler'))
BEGIN
	CREATE TABLE [dbo].[Scheduler](
		Id bigint IDENTITY(1,1) NOT NULL,
		OfficeId bigint NOT NULL,
		ScheduledFor datetime NOT NULL,
		Active bit NOT NULL,
		Repeatable bit NOT NULL,
		IsDeleted bit NOT NULL,
		DateCreated datetime NOT NULL,
		DateModified datetime NOT NULL,
		LastModifiedBy bigint NOT NULL,
		CONSTRAINT [PK_Scheduler] PRIMARY KEY CLUSTERED 
		(
			   [Id] ASC
		)   WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	);
END
