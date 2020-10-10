from googleapiclient.discovery import build
from decouple import config
import pickle

api_key = config('YOUTUBE_API_KEY')
youtube = build('youtube','v3',developerKey= api_key)

    
def retreive_youtube_data(query):
    '''
    Sends a get request to YouTube API and inputs the response into a list of videos.

    Each video is of form:
        video = {
            'thumbnail_image' : "",
            'url' : video.full_url (empty for video),
            'title' : video.title,
            'content_author': vide.content_author,
            'type': 'video'
        }

    Thumbnail Image direct link (if not a video)
    Content url (youtube link, wikipedia link)
    Content title
    Content author
    Type (video, not video)
    '''


    video_info = []
    
    request = youtube.search().list(
        part ='snippet',
        maxResults = 20,
        q = query,
        type = 'video'
    )

    response = request.execute()
    start_url = "https://www.youtube.com/watch?v="


    for video in response['items']:

        full_url = start_url+video['id']['videoId']
        title = video['snippet']['title']
        content_author = video['snippet']['channelTitle']
        curr_dict = {
            'thumbnail_image' : "",
            'url' : full_url,
            'title' : title,
            'content_author': content_author,
            'type': 'video'
        }
        video_info.append(curr_dict)

        #print("VIDEO ID: ", full_url)
        #print("video_title: ", title)
        #print("CHANNEL NAME: ", content_author)

    return video_info
