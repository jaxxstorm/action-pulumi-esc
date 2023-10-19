# `pulumi-esc` GitHub Action

This repository contains an action for reading values from Pulumi ESC, which allows you to securely read hierarchical configuration and secrets from defined environments.

This action uses JSON path expressions to parse the returned JSON from the Pulumi ESC API.

## Usage

### Open and read an environment

```yaml
# ...
steps:
  - name: Retrieve values
    uses: jaxxstorm/action-pulumi-esc@main
    id: esc
    with:
      access-token: ${{ secrets.PULUMI_ACCESS_TOKEN }}
      organization: <your pulumi org>
      environment: <environment-to-use>
      keys: '$.properties.environmentVariables.value.EXAMPLE_SETTING.value'
  - name: Use the output
    run: |
      echo "The extracted values are: ${{ steps.esc.outputs.result }}"
```

### Use the output values


### Use the output values in plaintext

```yaml
steps:
  - name: Plaintext ESC Action
    id: plaintext
    uses: ./
    with:
      access-token: ${{ secrets.PULUMI_ACCESS_TOKEN }}
      organization: <your pulumi org>
      environment: <environment-to-use>
      keys: '$.properties.environmentVariables.value.EXAMPLE_SETTING.value'
      secret: false
```
