IF (NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND  TABLE_Name = 'Equipment'))
BEGIN
	CREATE TABLE [dbo].[Equipment](
		[Id] bigint IDENTITY(1,1) NOT NULL,
		[ItemId] bigint NOT NULL,
		[UserId] bigint,
		[ItemCode] varchar(50) NOT NULL,
		[IsDeleted] bit NOT NULL,
		[DateCreated] datetime NOT NULL,
		[DateModified] datetime NOT NULL,
		CONSTRAINT [PK_Equipment] PRIMARY KEY CLUSTERED 
		(
			   [Id] ASC
		)   WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	);
END 