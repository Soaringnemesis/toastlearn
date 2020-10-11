from googleapiclient.discovery import build
from decouple import config
import pickle

api_key = config('YOUTUBE_API_KEY')
youtube = build('youtube','v3',developerKey= api_key)

def retrieve_youtube_data(query):
    """
    Thumbnail Image direct link (if not a video)
    Content url (youtube link, wikipedia link)
    Content title
    Content author
    Type (video, not video)
    """


    video_info = []
    
    request = youtube.search().list(
        part ="snippet",
        maxResults = 20,
        q = query,
        type = "video"
    )

    response = request.execute()
    start_url = "https://www.youtube.com/watch?v="


    for video in response["items"]:

        full_url = start_url+video["id"]["videoId"]
        title = video["snippet"]["title"]
        content_author = video["snippet"]["channelTitle"]
        curr_dict = {
            "thumbnail_image" : "",
            "url" : full_url,
            "title" : title,
            "content_author": content_author,
            "type": "video"
        }
        video_info.append(curr_dict)

        #print("VIDEO ID: ", full_url)
        #print("video_title: ", title)
        #print("CHANNEL NAME: ", content_author)

    return video_info


#if __name__ == "__main__":
#    print("START OF SCRIPT")
#    print("----------------------")
#    #get_key()
#    topics = retrieve_toast_topics()
#    create_database_values(topics)
#
#    print("END OF SCRIPT")
