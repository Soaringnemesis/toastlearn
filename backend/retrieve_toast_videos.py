from googleapiclient.discovery import build
from decouple import config
import pickle

api_key = config('YOUTUBE_API_KEY')
youtube = build('youtube','v3',developerKey= api_key)


def create_database_values(topics):
    data = {}  # data to send to firebase

    for tup in topics:
        topic = tup[0]
        tag = tup[1]

        if not data.get(tag):
            video_info = retreive_youtube_data(topic + " " + tag)
            data[tag] = {
                topic : { 'videos' : video_info}
            }
        else:
            data[tag][topic] = {'videos' : video_info}

    print(data) 
    #print(topics)
    
    

    #retreive_youtube_data("Implicit Differentiation" + " " + "calculus")

def retrieve_toast_topics():
    ''' 
        Retrieves the toast topics from the txt file
    '''
    f = open('toast_topics.txt','r')

    topics = []
    curr_tag = ""

    for x in f:
        arr = x.replace("\n","").split(" ")
        # print(arr)
        if x.split(" ")[0] == 'tag:':
            curr_tag = " ".join(arr[1:])
            #print(curr_tag)
        else:
            if arr[0] != '':
                curr_topic = " ".join(arr)
                #print(curr_topic)
                topics.append( (curr_topic, curr_tag))
    return topics

def retreive_youtube_data(query):
    '''
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


if __name__ == "__main__":
    print("START OF SCRIPT")
    print("----------------------")
    #get_key()
    topics = retrieve_toast_topics()
    create_database_values(topics)

    print("END OF SCRIPT")
