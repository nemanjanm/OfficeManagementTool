IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = 'dbo' AND CONSTRAINT_NAME='FK_Item_Category' AND TABLE_NAME='Item')
AND EXISTS (select 1 from INFORMATION_SCHEMA.COLUMNS Where COLUMN_NAME='CategoryId' AND TABLE_NAME='Item' AND TABLE_SCHEMA='dbo')
AND EXISTS (select 1 from INFORMATION_SCHEMA.COLUMNS Where COLUMN_NAME='Id' AND TABLE_NAME = 'Category' AND TABLE_SCHEMA='dbo')
BEGIN
	ALTER TABLE Item
	ADD CONSTRAINT FK_Item_Category FOREIGN KEY ([CategoryId]) REFERENCES Category([Id]);
END