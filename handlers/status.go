package handlers

import (
	"fmt"
	"net/http"

	"github.com/byuoitav/common/log"
	"github.com/labstack/echo"
)

var statusMap map[string]string

// SetStatus sets a person's status on the server
func SetStatus(context echo.Context) error {
	name := context.Param("name")
	status := context.Param("status")

	statusMap[name] = status

	msg := fmt.Sprintf("%s's status was set to: %s", name, status)

	log.L.Debug(msg)

	return context.JSON(http.StatusOK, msg)
}

// GetStatus gets a person's status from the server
func GetStatus(context echo.Context) error {
	name := context.Param("name")

	log.L.Debugf("Getting status of %s...", name)

	return context.JSON(http.StatusOK, statusMap[name])
}
