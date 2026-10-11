# Python services

This directory contains specialized Python services used by PharmaSense. These services handle forecasting and chatbot processing while the Node.js backend remains responsible for application access control and core business operations.

## Directory layout

| Directory      | Purpose                                                   |
| -------------- | --------------------------------------------------------- |
| `forecasting/` | Demand forecasting from historical sales data.            |
| `chatbot/`     | Business-chatbot processing using a locally hosted model. |

The backend communicates with these services through internal APIs. Keep each service's source and dependencies with that service.

Store model weights in the ignored root `model-weights/` directory and private datasets in `local-data/`. Neither belongs in the source tree.

Service implementations, dependencies, tests, and Python lint/format configuration have not been added yet.
