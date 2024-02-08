IF (NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND  TABLE_Name = 'OrderAttachment'))
BEGIN
	CREATE TABLE [dbo].[OrderAttachment](
		[Id] bigint IDENTITY(1,1) NOT NULL,
		[FileName] VARCHAR NOT NULL,
		[MimeType] varchar NOT NULL,
		[FileContent] varbinary(max) NOT NULL,
		[OrderId] bigint NOT NULL,
		[IsDeleted] bit NOT NULL,
		[DateCreated] datetime NOT NULL,
		[DateModified] datetime NOT NULL,
		CONSTRAINT [PK_OrderAttachment] PRIMARY KEY CLUSTERED 
		(
			   [Id] ASC
		)   WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	);
END
