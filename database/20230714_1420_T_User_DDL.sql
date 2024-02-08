IF (EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND  TABLE_Name = 'User'))
BEGIN
	IF(NOT EXISTS (select 1 from sys.columns Where Name='ResetPasswordToken' AND Object_ID = Object_ID('dbo.User')))
	BEGIN
		ALTER TABLE [dbo].[User]
		ADD [ResetPasswordToken] varchar(100) NULL
	END
	IF(NOT EXISTS (select 1 from sys.columns Where Name='ResetPasswordTokenExpirationTime' AND Object_ID = Object_ID('dbo.User')))
	BEGIN
		ALTER TABLE [dbo].[User]
		ADD [ResetPasswordTokenExpirationTime] datetime NULL;
	END
	
END
