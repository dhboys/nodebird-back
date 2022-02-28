module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', { // MySQL에는 posts 테이블 생성
  // id가 기본적으로 들어있다.
  content: {
      type: DataTypes.TEXT,
      allowNull: false,  // 필수
  },
}, {
    // user 모델에 대한 세팅 (mb4 - 이모티콘을 위함)
  charset: 'utf8mb4',
  collate: 'utf8mb4_general_ci', // 한글 저장
});
  Post.associate = (db) => {
    // post는 user에 속해 있다. 
    db.Post.belongsTo(db.User);
    // 하나의 post에 댓글이 여러개 있다.
    db.Post.hasMany(db.Comment);
    // 하나의 post에 이미지가 여러개 있다.
    db.Post.hasMany(db.Image);
    // 하나의 post에 여러개의 hashtag 가능하고 하나의 hashtag 또한 여러개의 post에 가능 (다대다)
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    // 좋아요(User)와 Post의 관계는 다대다 (through를 통해 중간 테이블명을 정할 수 있다.)
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    // Retweet 을 위한 관계, 하나의 Post에 여러개의 tweet
    db.Post.belongsTo(db.Post, { as: 'Retweet' });
  };
  return Post;
};