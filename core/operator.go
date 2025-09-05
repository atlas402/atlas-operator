package core

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type AtlasOperator struct {
	anthropicAPIKey string
	facilitatorURL  string
	httpClient      *http.Client
}

func New(anthropicAPIKey, facilitatorURL string) *AtlasOperator {
	return &AtlasOperator{
		anthropicAPIKey: anthropicAPIKey,
		facilitatorURL:  facilitatorURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

func (o *AtlasOperator) DiscoverServices(ctx context.Context, filters map[string]string) ([]map[string]interface{}, error) {
	url := fmt.Sprintf("%s/discovery/resources", o.facilitatorURL)
	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, err
	}

	q := req.URL.Query()
	for k, v := range filters {
		q.Add(k, v)
	}
	req.URL.RawQuery = q.Encode()

	resp, err := o.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Resources []map[string]interface{} `json:"resources"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result.Resources, nil
}


