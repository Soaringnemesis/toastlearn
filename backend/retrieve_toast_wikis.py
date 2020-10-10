import requests, random

S = requests.Session()

URL = "https://en.wikipedia.org/w/api.php"

def retrieve_wiki_data(topic):
	PARAMS = {
	    "action": "query",
	    "format": "json",
	    "list": "search",
	    "srsearch": topic
	}

	R = S.get(url=URL, params=PARAMS)
	DATA = R.json()

	page = DATA["query"]["search"][0]

	article = {}
	article["title"], article["snippet"] = page["title"], page["snippet"]
	page_url = f"https://en.wikipedia.org/wiki/{article['title']}"
	article["url"] = page_url

	return article


#if __name__ == "__main__":
	#print("START OF SCRIPT")
	#print("----------------------")
	#get_key()
	#topics = retrieve_toast_topics()
	#for tup in topics:
	#	topic = tup[0]
	#	tag = tup[1]
	#	print(retrieve_wiki_data(topic + " " + tag))
	#print("END OF SCRIPT")
	