**Simple paginated request :**

ALTER proc [dbo].[Messages_GetBySenderConversation]
@PageIndex int
,@PageSize int
,@CreatedBy int
,@RecipientId int

AS
/\*
DECLARE @PageIndex int = 0,
@PageSize int = 10,
@CreatedBy int = 1,
@RecipientId int = 2;

EXECUTE dbo.Messages_GetBySenderConversation
@PageIndex
,@PageSize
,@CreatedBy
,@RecipientId

_/
DECLARE @offset int = @PageIndex _ @PageSize

    SELECT  Id
    		,Message
    		,Subject
    		,RecipientId
    		,SenderId
    		,DateSent
    		,DateRead
    		,DateCreated
    		,DateModified
    		,TotalCount = COUNT(1) OVER()
    FROM [dbo].[Messages]
    WHERE @CreatedBy = SenderId AND @RecipientId = RecipientId

    ORDER BY DateCreated

    	OFFSET @offSet Rows
    	FETCH NEXT @PageSize Rows ONLY

**Select using integer with subquery:**

ALTER PROC [dbo].[EventInformation_SelectById]
@Id int
AS
/\*
DECLARE @Id int = 2

EXECUTE dbo.EventInformation_SelectById @Id

\*/
BEGIN

    Select e.Id
    		, et.Name AS EventType
    		, e.Name
    		, e.Summary
    		, e.ShortDescription
    		, es.Name AS EventStatus
    		, e.ImageUrl
    		, ExternalSiteUrl
    		, isFree
    		, DateStart
    		, DateEnd
    		, v.Id AS VenueId
    		, v.Name AS VenueName
    		, v.Description
    		, v.Url as VenueUrl
    		, Location = (SELECT l.Id
    					, lt.Name
    					, l.LineOne
    					, l.LineTwo
    					, l.City
    					, st.Name AS State
    					, l.Zip
    					, l.Latitude
    					, l.Longitude
    					, l.DateCreated
    					, l.DateModified
    				FROM dbo.Locations AS l LEFT OUTER JOIN dbo.States AS st
    					ON l.StateId = st.Id
    				LEFT OUTER JOIN dbo.LocationTypes AS lt
    					ON lt.Id = l.LocationTypeId
    				WHERE v.LocationId = l.Id
    					FOR JSON AUTO)

    FROM dbo.Events AS e LEFT OUTER JOIN dbo.Venues AS v
    	ON e.VenueId = v.Id
    LEFT OUTER JOIN dbo.EventTypes AS et
    	ON e.EventTypeId = et.Id
    LEFT OUTER JOIN dbo.EventStatus AS es
    	ON e.EventStatusId = es.Id
    Where @Id = e.Id

END

T-SQL paginated response with search parameters:
ALTER proc [dbo].[Friends_Search_PaginationV3_Trans]
@PageIndex int
, @PageSize int
, @Query nvarchar(100)

AS

/\*---Test Code---

Declare @Query nvarchar(100) = 'Chilli'
,@PageIndex int = 0
,@PageSize int = 10;

Execute [dbo].[Friends_Search_PaginationV3_Trans] @PageIndex
, @PageSize
, @Query
\*/

SET XACT_ABORT ON

    DECLARE @Tran nvarchar(50)  = 'Friends_Search_PaginationV3_Trans'

BEGIN TRY

BEGIN Transaction @Tran

    Declare @offset int = @PageIndex * @PageSize

    	SELECT f.Id
    		,img.Url
    		,img.Id
    		,img.TypeId
    		,f.Title
    		,f.Bio
    		,f.Summary
    		,f.Headline
    		,f.Slug
    		,f.StatusId
    		,f.DateModified
    		,f.DateCreated
    		,f.UserId
    		,Skills = (Select s.Id AS SkillId,s.Name AS SkillName
    			FROM dbo.FriendSkills AS fs
    			inner join dbo.Skills AS s
    			ON fs.SkillId = s.Id
    			WHERE fs.FriendId = f.Id
    			For JSON AUTO)
    		, TotalCount = COUNT(1) OVER()
    	FROM [dbo].[Friends] AS f inner join dbo.Images AS img
    		ON f.PrimaryImageId = img.Id

    	WHERE (f.Title LIKE '%' + @Query + '%')

    	ORDER BY f.Id
    		OFFSET @offSet Rows
    	Fetch Next @PageSize Rows ONLY

Commit Transaction @Tran

END TRY
BEGIN Catch

    IF (XACT_STATE()) = -1
    BEGIN
        PRINT 'The transaction is in an uncommittable state.' +
              ' Rolling back transaction.'
        ROLLBACK TRANSACTION @Tran;;
    END;

    -- Test whether the transaction is active and valid.
    IF (XACT_STATE()) = 1
    BEGIN
        PRINT 'The transaction is committable.' +
              ' Committing transaction.'
        COMMIT TRANSACTION @Tran;;
    END;

        -- If you want to see error info
       -- SELECT
        --ERROR_NUMBER() AS ErrorNumber,
        --ERROR_SEVERITY() AS ErrorSeverity,
        --ERROR_STATE() AS ErrorState,
       -- ERROR_PROCEDURE() AS ErrorProcedure,
       -- ERROR_LINE() AS ErrorLine,
       -- ERROR_MESSAGE() AS ErrorMessage

-- to just get the error thrown and see the bad news as an exception
THROW

End Catch

SET XACT_ABORT OFF

**Insert utilizing UDTs:**

ALTER   proc [dbo].[Friends_InsertV3_Trans]
         @Title nvarchar(50)
		,@Bio nvarchar(50)
		,@Summary nvarchar(50)
		,@Headline nvarchar(50)
		,@Slug nvarchar(50)
		,@StatusId int		
		,@TypeId int
		,@PrimaryImageUrl nvarchar(max)
		,@UserId int
		,@Skills dbo.Skills_V2 READONLY
		,@Id int OUTPUT

		
AS

SET XACT_ABORT ON

Declare @Tran nvarchar(50)  = 'Friend_InsertV3_Trans'
/* ---Test Code ---

Declare @Id int = 0
					,@Skills dbo.Skills_V2

			Insert Into @Skills (Id, Name)
				Values (3, 'Making Up Games')
			Insert Into @Skills (Id, Name)
				Values (4, 'JavaScript')
			Insert Into @Skills (Id, Name)
				Values (5, 'Telekenesis')
		

			Declare @Title nvarchar(50) = 'Banjo'
					,@Bio nvarchar(50) = 'Australia, has never been the same.'
					,@Summary nvarchar(50) = 'Lives fully'
					,@Headline nvarchar(50) = 'Bingos Classmate'
					,@Slug nvarchar(50) = 'banjo@pincer.au'
					,@StatusId int = 1
					,@TypeId int = 1
					,@PrimaryImageUrl nvarchar(max) = 'https://www.bluey.tv/wp-content/uploads/2019/04/char-bluey@2x.png'
					,@UserId int = 123324


Execute Friends_InsertV3_Trans @Title 
								,@Bio 
								,@Summary 
								,@Headline 
								,@Slug 
								,@StatusId
								,@TypeId 
								,@PrimaryImageUrl 
								,@UserId 
								,@Skills dbo.Skills_V2 
								,@Id OUTPUT


*/

BEGIN TRY

BEGIN Transaction @Tran

	
					Declare @PrimaryImageId int		
			,@FriendId int
			,@SkillId int
			

			INSERT INTO [dbo].Images
							([TypeId]
							,[Url])

			VALUES 
							(@TypeId
							,@PrimaryImageUrl)

							SET @PrimaryImageId = SCOPE_IDENTITY() 

			INSERT INTO [dbo].[Friends]
							([Title]
							,[Bio]
							,[Summary]
							,[Headline]
							,[Slug]
							,[StatusId]
							,[PrimaryImageId]
							,[UserId])

			VALUES
         
							(@Title
							,@Bio
							,@Summary
							,@Headline
							,@Slug
							,@StatusId	
							,@PrimaryImageId
							,@UserId)

			  SET @FriendId = SCOPE_IDENTITY()

			 INSERT INTO dbo.Skills
							([Name])

			 Select sk.[Name]
			 From @Skills AS sk
			 Where not exists (Select s.Id
									  ,s.[Name]
								FROM dbo.Skills as s
								WHERE s.[Name] = sk.[Name])

			 SET @SkillId = SCOPE_IDENTITY()
			
			INSERT INTO dbo.FriendSkills

							(SkillId
							, FriendId)

			Values
							(@SkillId,
							@FriendId)
 
			Select *
			FROM dbo.Skills
	
			Select *
			FROM dbo.Friends

			Select *
			FROM @Skills
	
	Commit Transaction @Tran

END TRY
BEGIN Catch

    IF (XACT_STATE()) = -1
    BEGIN
        PRINT 'The transaction is in an uncommittable state.' +
              ' Rolling back transaction.'
        ROLLBACK TRANSACTION @Tran;;
    END;

    -- Test whether the transaction is active and valid.
    IF (XACT_STATE()) = 1
    BEGIN
        PRINT 'The transaction is committable.' +
              ' Committing transaction.'
        COMMIT TRANSACTION @Tran;;
    END;

        -- If you want to see error info
       -- SELECT
        --ERROR_NUMBER() AS ErrorNumber,
        --ERROR_SEVERITY() AS ErrorSeverity,
        --ERROR_STATE() AS ErrorState,
       -- ERROR_PROCEDURE() AS ErrorProcedure,
       -- ERROR_LINE() AS ErrorLine,
       -- ERROR_MESSAGE() AS ErrorMessage

-- to just get the error thrown and see the bad news as an exception
    THROW

End Catch

SET XACT_ABORT OFF
