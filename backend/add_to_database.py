import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests
import retreive_toast_videos as youtube
#import retreive_toast_wikis as wiki

cred = credentials.Certificate('/Users/user/Downloads/team-proj-133-firebase-adminsdk-yrh4a-9d7abaa079.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

doc_ref = db.collection('html').document('3')

doc_ref.set({'name':'Typography'})
resources = doc_ref.collection('resources').document('1')

resources.set({'name':'value changed'})

def create_database_values(topics):
    '''
    Input:
        topics: list of tuples
            each tuple is of form  ( topic, subject(tag) )

    Output:
        data =  {
                subject : {
                    topic : {
                        videos : [list of videos],
                        articles: wikipedia_info (will be added in when scraping wikipedia)
                    }
                }
            }
    '''

    data = {}  # data to send to firebase

    #loop through the list of tuples
    for tup in topics:

        topic = tup[0]
        tag = tup[1]

        # retrieve scraped values 
        video_info = youtube.retreive_youtube_data(topic + " " + tag)
        wiki_info = wiki.retreive_wiki_data(topic + " " + tag)

        # if the current tag is not in dict, add it in
        if not data.get(tag):
            data[tag] = {
                topic : { 
                        'videos' : video_info, 
                        'wiki': wiki_info
                        }
            }
        else:
            data[tag][topic] = {
                    'videos' : video_info,
                    'wiki':wiki_info
                    }

    #print(data) 
    #print(topics)
    return data

def retrieve_toast_topics():
    ''' 
        Retrieves the toast topics from the txt file
        Outputs a list of tuples of form:       ( topic, subject )
    '''
    f = open('toast_topics.txt','r')

    topics = []
    curr_tag = ""

    for x in f:
        arr = x.replace("\n","").split(" ")
        #print(arr)
        if x.split(" ")[0] == 'tag:':
            curr_tag = " ".join(arr[1:])
            #print(curr_tag)
        else:
            if arr[0] != '':
                curr_topic = " ".join(arr)
                #print(curr_topic)
                topics.append( (curr_topic, curr_tag))
    return topics

if __name__ == "__main__":
    #topics = data.return_youtube_data()
    #add_values(topics)

    topics = retrieve_toast_topics()
    data = create_database_values(topics)

    #pickle.dump(data,open('data.p','w'))
