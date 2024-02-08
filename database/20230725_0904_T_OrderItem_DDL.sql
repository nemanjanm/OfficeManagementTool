IF (NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND  TABLE_Name = 'OrderItem'))
BEGIN
	CREATE TABLE [dbo].[OrderItem](
		[Id] bigint IDENTITY(1,1) NOT NULL,
		[OrderId] bigint NOT NULL,
		[ItemId] bigint NOT NULL,
		[Amount] int NOT NULL,
		[IsDeleted] bit NOT NULL,
		[DateCreated] datetime NOT NULL,
		[DateModified] datetime NOT NULL,
		CONSTRAINT [PK_OrderItem] PRIMARY KEY CLUSTERED 
		(
			   [Id] ASC
		)   WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
	);
END
