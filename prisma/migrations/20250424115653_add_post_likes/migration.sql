-- CreateTable
CREATE TABLE "PostLike"
(
    "userId"    INTEGER      NOT NULL,
    "postId"    INTEGER      NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("userId", "postId")
);

-- CreateIndex
CREATE INDEX "byPost" ON "PostLike" ("postId");

-- AddForeignKey
ALTER TABLE "PostLike"
    ADD CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike"
    ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("postId") ON DELETE RESTRICT ON UPDATE CASCADE;
