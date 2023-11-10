import { TwitterApi } from 'twitter-api-v2';
import { config } from 'dotenv';
config();
//https://twitter.com/ivan4722
// Your code using TwitterApi here
const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });
  
  export async function postTweet(tweetText) 
  {
    try 
    {
      const tweet = await client.v2.tweet(tweetText);
      console.log(tweet.data.id);
    } 
    catch (error) 
    {
      console.error(`Failed to post tweet: ${error}`);
    }
  }