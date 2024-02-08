IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = 'dbo' AND CONSTRAINT_NAME='FK_OrderItem_Item' AND TABLE_NAME='OrderItem')
AND EXISTS (select 1 from INFORMATION_SCHEMA.COLUMNS Where COLUMN_NAME='ItemId' AND TABLE_NAME='OrderItem' AND TABLE_SCHEMA='dbo')
AND EXISTS (select 1 from INFORMATION_SCHEMA.COLUMNS Where COLUMN_NAME='Id' AND TABLE_NAME = 'Item' AND TABLE_SCHEMA='dbo')
BEGIN
	ALTER TABLE OrderItem
	ADD CONSTRAINT FK_OrderItem_Item FOREIGN KEY ([ItemId]) REFERENCES Item([Id]);
END
