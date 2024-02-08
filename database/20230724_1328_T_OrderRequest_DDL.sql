IF (NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND  TABLE_Name = 'OrderRequest'))
BEGIN
	CREATE TABLE [dbo].[OrderRequest](
		[Id] bigint IDENTITY(1,1) NOT NULL,
		[UserId] bigint NOT NULL,
		[ItemId] bigint NOT NULL,
		[Amount] int NOT NULL,
		[OfficeId] bigint NOT NULL,
		[InOrder] bit NOT NULL,
		[IsDeleted] bit NOT NULL,
		[DateCreated] datetime NOT NULL,
		[DateModified] datetime NOT NULL,
		CONSTRAINT [PK_OrderRequest] PRIMARY KEY CLUSTERED 
		(
			   [Id] ASC
		)   WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	);
END
