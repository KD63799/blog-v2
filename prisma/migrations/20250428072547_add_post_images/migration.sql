-- CreateTable
CREATE TABLE "PostImage"
(
    "id"        SERIAL       NOT NULL,
    "fileName"  TEXT         NOT NULL,
    "postId"    INTEGER      NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostImage"
    ADD CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("postId") ON DELETE CASCADE ON UPDATE CASCADE;
