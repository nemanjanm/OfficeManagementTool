IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = 'dbo' AND CONSTRAINT_NAME='FK_OrderItem_Order' AND TABLE_NAME='OrderItem')
AND EXISTS (select 1 from INFORMATION_SCHEMA.COLUMNS Where COLUMN_NAME='OrderId' AND TABLE_NAME='OrderItem' AND TABLE_SCHEMA='dbo')
AND EXISTS (select 1 from INFORMATION_SCHEMA.COLUMNS Where COLUMN_NAME='Id' AND TABLE_NAME = 'Order' AND TABLE_SCHEMA='dbo')
BEGIN
	ALTER TABLE OrderItem
	ADD CONSTRAINT FK_OrderItem_Order FOREIGN KEY ([OrderId]) REFERENCES [Order]([Id]);
END
