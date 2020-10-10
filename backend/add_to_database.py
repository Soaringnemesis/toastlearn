import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import requests
import retrieve_toast_videos as youtube
import retrieve_toast_wikis as wiki
import pickle
import json

cred = credentials.Certificate("/Users/user/Downloads/team-proj-133-firebase-adminsdk-yrh4a-9d7abaa079.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

def create_database_values(topics):
    """
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
    """

    data = {}  # data to send to firebase

    #loop through the list of tuples
    for tup in topics:

        topic = tup[0]
        tag = tup[1]

        # retrieve scraped values 
        video_info = youtube.retrieve_youtube_data(topic + " " + tag)
        wiki_info = wiki.retrieve_wiki_data(topic + " " + tag)

        # if the current tag is not in dict, add it in
        if not data.get(tag):
            data[tag] = {
                topic : { 
                        "videos" : video_info, 
                        "wiki": wiki_info
                        }
            }
        else:
            data[tag][topic] = {
                    "videos" : video_info,
                    "wiki":wiki_info
                    }

    #print(data) 
    #print(topics)
    return data

def retrieve_toast_topics():
    """ 
        Retrieves the toast topics from the txt file
        Outputs a list of tuples of form:       ( topic, subject )
    """
    f = open("toast_topics.txt","r")

    topics = []
    curr_tag = ""

    for x in f:
        arr = x.replace("\n","").split(" ")
        #print(arr)
        if x.split(" ")[0] == "tag:":
            curr_tag = " ".join(arr[1:])
            #print(curr_tag)
        else:
            if arr[0] != "":
                curr_topic = " ".join(arr)
                #print(curr_topic)
                topics.append( (curr_topic, curr_tag))
    return topics

def add_to_database(data):
    """   subject                                         resources
        collection -> Document                         -> collection
                        name: Implicit differentiation
                        tag: calculus1
    
         Documents       
    -->     type : video
            url : url 

            or

            type :  wiki
            url : url
    """
    # doc_ref = db.collection("subjects").document("3")

    # doc_ref_one = db.collection("subjects").document("100")
    # doc_ref_one.set(
    #     {"name":"Area under the curve",
    #         "tag":"calculus"
    #     })
    # collect = doc_ref_one.collection("resources")
    # doc_ref_two = collect.document("100")
    # doc_ref_two.set(
    #     {"name":"Area under the curve test video",
    #         "url":"areayoutubevideourl"
    #     })

    # numbering the Topic documents
    i = 0
    doc_ref_one = db.collection("subjects")
    for subject in data:

        # used for numbering resources
        resource_num = 0


        for topic in data[subject]:
            print(topic,subject)
            #print(str[i])

            # creating a document for every topic 
            curr_doc = doc_ref_one.document(str(i))

            # Document- name:Differentiation, tag: calculus
            curr_doc.set(
                    {"name":topic,
                    "tag":subject
            })

            # create/dive into a collection called resources
            resources_collection = curr_doc.collection("resources")
            #print(topic)

            # loop through every video
            for video in data[subject][topic]['videos']:

                # create a document with index resource_num
                curr_resource = resources_collection.document(str(resource_num))
                url = video["url"]
                title = video["title"]
                channel = video["content_author"]


                curr_resource.set({
                                "type":"video",
                                "url":url,
                                "title":title,
                                "channel":channel
                })

                resource_num+=1

            # add one more document, the Wiki page
            curr_resource = resources_collection.document(str(resource_num))

            #
            curr_wiki = data[subject][topic]["wiki"]
            url = curr_wiki["url"]
            title = curr_wiki["title"]
            snippet = curr_wiki["snippet"]

            curr_resource.set({"url":url,
                        "title":title,
                        "snippet":snippet,
                        "type":"wiki"
            })

            i += 1


    

if __name__ == "__main__":
    
    # doc_ref.set({"name":"Typography"})
            # resources = doc_ref.collection("resources").document("1")

            # resources.set({"name":"value changed"})
    #topics = data.return_youtube_data()
    #add_values(topics)

    #topics = retrieve_toast_topics()
    #data = create_database_values(topics)
    #print(data)
    #with open('data.txt','w') as outfile:
    #json.dump(data,outfile)
    with open('data.json') as json_file:
        data = json.load(json_file)
        add_to_database(data)
    
    #pickle.dump(data,open("data.p","w"))