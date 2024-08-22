function startCard(event){
  return {
    "card": {
      "header": {
        "title": "How can I help you?"
      },
      "sections": [
        {
        
          "widgets": [
            {
              "buttonList": {
                "buttons": [
                  {
                    "text": "I have some question about the company.",
                    "color": {
                      "red": 0.1,
                      "green": 0.1,
                      "blue": 0.1,
                      "alpha": 1
                    },
                    "onClick": {
                      "action": {
                        "function": "general",
                      }
                    },
                  },
                  
                ]
              }
            },
            {
              "buttonList": {
                "buttons": [
                  {
                    "text": "I wanna check my application.",
                    "color": {
                      "red": 0.1,
                      "green": 0.1,
                      "blue": 0.1,
                      "alpha": 1
                    },
                    "onClick": {
                      "action": {
                        "function": "checkApplicationStatus",
                      }
                    },
                  },
                  
                ]
              }
            }
          ]
        }
      ]
    }
  }
}

function statusCard(id, date, status, interview){
  return{
    "card": {
      "header": {
        "title": "Application Status"
      },
      "sections": [
        {
          "widgets": [
            {
              "decoratedText": {
                "icon": {
                  "knownIcon": "PERSON"
                },
                "text": id,
              }
            },
            {
              "decoratedText": {
                "icon": {
                  "knownIcon": "EMAIL"
                },
                "text": date,
              }
            },
            {
              "decoratedText": {
                "icon": {
                  "knownIcon": "DESCRIPTION"
                },
                "text": status,
              }
            },
            {
              "decoratedText": {
                "icon": {
                  "knownIcon": "INVITE"
                },
                "text": interview,
              }
            }
          ]
        }
      ]
    }
  }
}

function applicationCard(){
  return {
      "card": {
        "header": {
          "subtitle": "Send your resume or inquiries to this email!"
        },
        "sections": [
          {
            "header": "Contact Info",
            "collapsible": true,
            "uncollapsibleWidgetsCount": 10,
            "widgets": [
              {},
              {
                "decoratedText": {
                  "icon": {
                    "knownIcon": "EMAIL"
                  },
                  "text": "jialing0901@rallyhr.org"
                }
              }
            ]
          }
        ]
      }
    }
}

function feedbackCard(){
  return {
    'card': {
      "header": {
        "title": "Feedback",
        "subtitle": "Please leave some feedback so I can improve! ❤️",
      },
      "sections": [
        {
          "widgets": [
            {
              "textInput": {
                "name": "FEEDBACK",
                "label": "Feedback",
                
              }
            },
            {
          "buttonList": {
            "buttons": [
              {
                "text": "Submit",
                "color": {
                  "red": 0.1,
                  "green": 0.1,
                  "blue": 0.1,
                  "alpha": 1
                },
                "onClick": {
                  "action": {
                    "function": "sendFeedback",
                  }
                },
              },
              
            ]
          }
        }
          ]
        },
        
      ],
      
    }
  }
}

function slashCard (event) {
  return {
    'action_response': {
      'type': 'DIALOG',
      'dialog_action': {
        'dialog': {
          'body': {
            'sections': [
              {
                'header': 'Nice Card Builder',
                'collapsible': true,
                'uncollapsibleWidgetsCount': 2,
                'widgets': [
                  {
                    'textInput': {
                      'name': 'description',
                      'type': 'MULTIPLE_LINE',
                      'label': '📝 Description'
                    }
                  },
                  {
                    'textInput': {
                      'name': 'image_1',
                      'label': '1️⃣ Image URL',
                      'placeholderText': 'https://source.unsplash.com/featured/320x320'
                    }
                  },
                  {
                    'textInput': {
                      'name': 'image_2',
                      'label': '2️⃣'
                    }
                  },
                  {
                    'textInput': {
                      'name': 'image_3',
                      'label': '3️⃣'
                    }
                  }
                ]
              }
            ],
            'fixedFooter': {
              'primaryButton': {
                'icon': {
                  'materialIcon': {
                    'name': 'send'
                  }
                },
                'text': 'Send',
                'color': {
                  'red': 0,
                  'green': 0.5,
                  'blue': 1,
                  'alpha': 1
                },
                'onClick': {
                  'action': {
                    'function': 'receiveCard'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}