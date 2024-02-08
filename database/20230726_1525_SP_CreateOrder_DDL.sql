IF(NOT EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.ROUTINES WHERE Specific_schema='dbo' and specific_Name = 'CreateOrder' and Routine_Type='PROCEDURE'))
BEGIN
	EXEC('CREATE PROC dbo.CreateOrder AS SELECT 1')
END
GO

ALTER PROCEDURE [dbo].[CreateOrder] 
	@officeId BIGINT = 0
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @orderId BIGINT;
	IF (@officeId = 0)
	BEGIN
		SET @orderId = 0
		RETURN @orderId;
	END
	ELSE
	BEGIN
		IF EXISTS(SELECT 1 FROM OrderRequest WHERE OfficeId = @officeId AND InOrder = 0 AND IsDeleted = 0)
		BEGIN
			INSERT INTO [dbo].[Order] VALUES (@officeId, 0, GETDATE(), GETDATE(), 1);
			SET @orderId = SCOPE_IDENTITY();

			INSERT INTO [dbo].[OrderItem] (OrderId, ItemId, Amount, IsDeleted, DateCreated, DateModified) (
				SELECT @orderId, ItemId, SUM(Amount), 0, GETDATE(), GETDATE() 
				FROM [dbo].[OrderRequest]
				WHERE OfficeId = @officeId AND InOrder = 0 AND IsDeleted = 0
				GROUP BY ItemId
			);

			UPDATE [dbo].[OrderRequest]
			SET InOrder = 1
			WHERE OfficeId = @officeId AND IsDeleted = 0

			RETURN @orderId;
		END
		ELSE
		BEGIN
			SET @orderId = -1;
			RETURN @orderId;
		END
	END
END
GO