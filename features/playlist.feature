Background:
    Given a youtube playlist "samples/playlist.json" exists as "sample-playlist" from the api
    And I am navigate to "/p/sample-playlist"

Scenario: On desktop I can view some swenk swenk youtube playlist
    When I have a tablet screen size
    Then I see a list of videos:
    | id      | title           | published    | thumbnail                  | summary
    | swank   | Swanky McSwanks | Mar 18, 1985 | samples/swanky.png         | Probably the best video in the world.                                          |
    | harambe | Harambe         | May 29, 2016 | samples/big-ole-monkey.png | Parental delegation gone wrong.                                                |
    | daniel  | Damn daniel     | Feb 21, 2016 | samples/white-vans.png     | Daniel is back at it again with them white white vans.                         |
    | lolben  | Sad Ben Affleck | Mar 25, 2016 | samples/mixed-response.png | Hello darkness my old friend, I've come to talk to you again..                 |
    | arthur  | Relatable       | Jul 27, 2016 | samples/arthurs-fist.png   | ...                                                                            |
    | harold  | Harold          | Oct 23, 2011 | samples/hide-the-pain.png  | When you're writing dank specifications but all your memes are from last year. |

Scenario: On desktop I can click the title of a video to navigate to the detail view
    When I have a desktop screen size
    And I click on the video title "Damn daniel"
    Then I see the browser navigates to "/v/daniel"

Scenario: On desktop I can click the thumbnail of a video to navigate to the detail view
    When I have a desktop screen size
    And I click on the video thumbnail with the title "Sad Ben Affleck"
    Then I see the browser navigates to "/v/lolben"

Scenario: On mobile I can view some swenk swenk youtube playlist
    When I have a mobile screen size
    Then I see a list of videos:
    | id      | title           | published    | thumbnail                     |
    | swank   | Swanky McSwanks | Mar 18, 1985 | samples/sm-swanky.png         |
    | harambe | Harambe         | May 29, 2016 | samples/sm-big-ole-monkey.png |
    | daniel  | Damn daniel     | Feb 21, 2016 | samples/sm-white-vans.png     |
    | lolben  | Sad Ben Affleck | Mar 25, 2016 | samples/sm-mixed-response.png |
    | arthur  | Relatable       | Jul 27, 2016 | samples/sm-arthurs-fist.png   |
    | harold  | Harold          | Oct 23, 2011 | samples/sm-hide-the-pain.png  |

Scenario: On mobile I can click the title of a video to navigate to the detail view
    When I have a mobile screen size
    And I click on the video title "Damn daniel"
    Then I see the browser navigates to "/v/daniel"

Scenario: On mobile I can click the thumbnail of a video to navigate to the detail view
    When I have a mobile screen size
    And I click on the video thumbnail with the title "Sad Ben Affleck"
    Then I see the browser navigates to "/v/lolben"
