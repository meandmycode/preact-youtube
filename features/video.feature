Feature: Video
    As a user of the best youtube app ever made
    I want to be able to view the dankest of videos
    So that I can listen to the sickest trap

    Background:
        Given a youtube video "sample-video.json" exists as "sample-video" from the api

    Scenario:
        And I have a tablet device
        And I navigate to "/v/sample-video"
        Then I see the video:
        | id        | swank                                 |
        | title     | Swanky McSwanks                       |
        | published | Mar 18, 1985                          |
        | summary   | Probably the best video in the world. |

    Scenario:
        And I have a mobile device
        And I navigate to "/v/sample-video"
        Then I see the video:
        | id        | swank                                 |
        | title     | Swanky McSwanks                       |
        | published | Mar 18, 1985                          |
        | summary   | Probably the best video in the world. |
