# Send notifications from your GitHub workflows

Use this GitHub action to inform yourself or your team about activity in your repository. Think of use cases like:

- sending your team a notification when an issue is labelled `critical`
- sending devops a notification when a deployment fails
- sending yourself a notification when a new pull request is opened
- sending the contributor a notification when their pull request is merged
- sending a Slack message to your announcements channel on a new release

## Usage

```yaml
name: 'Notify Me'
on: pull_request

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Notification
        uses: magicbell-io/action/notify@v1
        with:
          api-key: ${{ secrets.MAGICBELL_API_KEY }}
          api-secret: ${{ secrets.MAGICBELL_API_SECRET }} 
          recipients: 'person@example.com, bot@example.com'
          title: 'Activity on pull ${{ github.event.number }}!'
```

## Inputs

The `notify` action accepts a number of options. The following options are required for all calls:

- **api-key** _String_
  
  Your project api key which can be found on the MagicBell Dashboard. This key is required for all calls.

- **api-secret** _String_

  Your project api secret which can be found on the MagicBell Dashboard. This key is required for project oriented endpoints.

- **title** _String_

  The title of the notification.

- **recipients** _String_

  A comma (`,`) separated list of recipients, currently limited to email addresses.

The following options are optional:


- **content** _String_

  The content of the notification.

- **category** _String_
 
  The category of the notification. This can be used to group notifications together.

- **topic** _String_

  The topic of the notification. This can be used to thread notifications.

- **action-url** _String_

  The URL to which the notification will link to.

- **custom-attributes** _JSON_

  A JSON string of custom attributes to be attached to the notification. Tip; use the GitHub `${{ toJson(...) }}` helper.

- **overrides** _JSON_

  A JSON string of delivery overrides to be attached to the notification. Tip; use the GitHub `${{ toJson(...) }}` helper.

## Recipes

### Sending the contributor a notification on push

```yaml
name: 'Notify Contributor'

on: push

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Notification
        uses: magicbell-io/action/notify@v1
        with: # api-key, api-secret, recipients and title are required.
          api-key: ${{ secrets.MAGICBELL_API_KEY }}
          api-secret: ${{ secrets.MAGICBELL_API_SECRET }}
          recipients: '${{ github.event.pusher.email }}'
          title: 'Thanks for pushing!'
```

### Sending a notification on pull request activity

```yaml
name: 'Notify on pull request'

on: pull_request

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Notification
        uses: magicbell-io/action/notify@v1
        with: # api-key, api-secret, recipients and title are required.
          api-key: ${{ secrets.MAGICBELL_API_KEY }}
          api-secret: ${{ secrets.MAGICBELL_API_SECRET }} 
          recipients: '${{ secrets.MY_EMAIL }}'
          title: 'Activity on pull ${{ github.event.number }}!'
          action-url: 'https://github.com/${{ github.repository }}/pulls/${{ github.event.number }}'
```

### Sending a notification when publishing a release

```yaml
name: On Release

on:
  release:
    types: [published]

jobs:
  notify:
    name: Send Release Notes
    runs-on: ubuntu-latest

    steps:
      - name: Send Notification
        uses: magicbell-io/action/notify@v1
        with:
          api-key: ${{ secrets.MAGICBELL_API_KEY }}
          api-secret: ${{ secrets.MAGICBELL_API_SECRET }}
          recipients: ${{ secrets.MY_EMAIL }}
          title: 'Just Released: ${{ github.event.release.name }}!'
          content: ${{ github.event.release.body }}
          action-url: ${{ github.event.release.html_url }}
```

### Sending a notification when an issue gets created

```yaml
name: On Issue Created

on:
  issues:
    types: [opened]

jobs:
  notify-me:
    runs-on: ubuntu-latest
    steps:
      - name: Send Notification
        uses: magicbell-io/action/notify@main
        with:
          api-key: ${{ secrets.MAGICBELL_API_KEY }}
          api-secret: ${{ secrets.MAGICBELL_API_SECRET }}
          recipients: '${{ secrets.MY_EMAIL }}'
          title: 'Issue created: ${{ github.event.issue.number }} - ${{ github.event.issue.title }}'
          content: ${{ github.event.issue.body }}
          action-url: ${{ github.event.issue.html_url }}
          custom-attributes: ${{ toJSON(github.event.issue) }}
```

### Sending a notification when an issue gets labelled

```yaml
name: On Issue Labeled Critical

on:
  issues:
    types: [labeled]

jobs:
  notify:
    if: github.event.label.name == 'critical'
    runs-on: ubuntu-latest
    
    steps:
      - name: Send Notification
        uses: magicbell-io/action/notify@v1
        with:
          api-key: ${{ secrets.MAGICBELL_API_KEY }}
          api-secret: ${{ secrets.MAGICBELL_API_SECRET }}
          recipients: ${{ secrets.MY_EMAIL }}
          title: 'Issue declared critical: ${{ github.event.issue.number }} - ${{ github.event.issue.title }}'
```
