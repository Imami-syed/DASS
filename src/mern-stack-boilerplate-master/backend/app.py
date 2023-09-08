from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from bson.objectid import ObjectId
from flask_cors import CORS
import yaml
import json
import pandas as pd

app = Flask(__name__)
app.config['UPLOAD_PATH'] = 'uploads'
config = yaml.load(open('database.yaml'))
client = MongoClient(config['uri'])
db = client['Smartterra']
CORS(app)

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/api/upload', methods=['POST', 'GET'])
def upload_data():
    if request.method == 'POST':
        file = request.files['file']
        filename = file.filename

        df = pd.read_csv(file)
        df.to_json('/home/imami/Documents/dasspro/DASS2K22-Team-30-dev/src/mern-stack-boilerplate-master/backend/uploads/' +
                   filename, orient='records')

        # open the json file
        with open('/home/imami/Documents/dasspro/DASS2K22-Team-30-dev/src/mern-stack-boilerplate-master/backend/uploads/' + filename) as json_file:
            data = json.load(json_file)
            for p in data:
                db['data'].insert_one(p)
            return jsonify({'message': 'File uploaded successfully'})
        return jsonify({'filename': 'blank'})
    else:
        return jsonify({'filename': 'error'})

@app.route('/api/data', methods=['GET'])
def get_data():
    data = db['data'].find()
    output = []
    for d in data:
        output.append({'_id': str(d['_id']), 'Date': d['Date'], 'Time': d['Time'], 'Date & Time': d['Date & Time'], 'IP - EMF 23': d['IP - EMF 23'], 'IP - EMF 33': d['IP - EMF 33'], 'IP - EMF 47': d['IP - EMF 47'], 'WS01-DMA07-CMP01': d['WS01-DMA07-CMP01'], 'WS01-DMA07-CMP 02': d['WS01-DMA07-CMP 02'], 'WS01-DMA07-CMP 03': d['WS01-DMA07-CMP 03'],  'WS01-DMA07-AZP 01': d['WS01-DMA07-AZP 01'], 'IF - EMF 23': d['IF - EMF 23'], 'IF - EMF 33': d['IF - EMF 33'], 'IF - EMF 47': d['IF - EMF 47']})
    return jsonify({'data': output})

    

# 'WS01-DMA07-CMP04': d['WS01-DMA07-CMP04'],        
    

# @app.route('/users', methods=['POST', 'GET'])
# def data():
    
#     # POST a data to database
#     if request.method == 'POST':
#         body = request.json
#         firstName = body['firstName']
#         lastName = body['lastName']
#         emailId = body['emailId'] 
#         # db.users.insert_one({
#         db['users'].insert_one({
#             "firstName": firstName,
#             "lastName": lastName,
#             "emailId":emailId
#         })
#         return jsonify({
#             'status': 'Data is posted to MongoDB!',
#             'firstName': firstName,
#             'lastName': lastName,
#             'emailId':emailId
#         })
    
#     # GET all data from database
#     if request.method == 'GET':
#         allData = db['users'].find()
#         dataJson = []
#         for data in allData:
#             id = data['_id']
#             firstName = data['firstName']
#             lastName = data['lastName']
#             emailId = data['emailId']
#             dataDict = {
#                 'id': str(id),
#                 'firstName': firstName,
#                 'lastName': lastName,
#                 'emailId': emailId
#             }
#             dataJson.append(dataDict)
#         print(dataJson)
#         return jsonify(dataJson)

# @app.route('/users/<string:id>', methods=['GET', 'DELETE', 'PUT'])
# def onedata(id):

#     # GET a specific data by id
#     if request.method == 'GET':
#         data = db['users'].find_one({'_id': ObjectId(id)})
#         id = data['_id']
#         firstName = data['firstName']
#         lastName = data['lastName']
#         emailId = data['emailId']
#         dataDict = {
#             'id': str(id),
#             'firstName': firstName,
#             'lastName': lastName,
#             'emailId':emailId
#         }
#         print(dataDict)
#         return jsonify(dataDict)
        
#     # DELETE a data
#     if request.method == 'DELETE':
#         db['users'].delete_many({'_id': ObjectId(id)})
#         print('\n # Deletion successful # \n')
#         return jsonify({'status': 'Data id: ' + id + ' is deleted!'})

#     # UPDATE a data by id
#     if request.method == 'PUT':
#         body = request.json
#         firstName = body['firstName']
#         lastName = body['lastName']
#         emailId = body['emailId']

#         db['users'].update_one(
#             {'_id': ObjectId(id)},
#             {
#                 "$set": {
#                     "firstName":firstName,
#                     "lastName":lastName,
#                     "emailId": emailId
#                 }
#             }
#         )

#         print('\n # Update successful # \n')
#         return jsonify({'status': 'Data id: ' + id + ' is updated!'})

if __name__ == '__main__':
    app.debug = True
    app.run()
