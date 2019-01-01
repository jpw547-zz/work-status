package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/byuoitav/common/log"
	"github.com/byuoitav/common/v2/events"
	"github.com/jpw547/work-status/provisioning"
	"github.com/labstack/echo"
)

var (
	statusMap   map[string]string
	updateEvent events.Event
)

func init() {
	statusMap = map[string]string{
		"john":    "out",
		"parker":  "out",
		"caleb":   "out",
		"smitty":  "out",
		"matt":    "out",
		"joe":     "out",
		"danny":   "out",
		"clinton": "out",
	}

	updateEvent = events.Event{
		GeneratingSystem: "Derek",
		Key:              "update",
	}
}

// SetStatus sets a person's status on the server
func SetStatus(context echo.Context) error {
	name := strings.ToLower(context.Param("name"))
	status := strings.ToLower(context.Param("status"))

	statusMap[name] = slightlySneaky(status)

	msg := fmt.Sprintf("%s's status was set to: %s", strings.Title(name), status)

	updateEvent.Timestamp = time.Now()
	updateEvent.User = name
	updateEvent.Value = status

	provisioning.SocketManager().WriteToSockets(updateEvent)

	log.L.Debug(msg)

	return context.JSON(http.StatusOK, msg)
}

func slightlySneaky(status string) string {
	if strings.EqualFold(status, "starcraft") {
		return "team building"
	}
	if strings.EqualFold(status, "dnd") {
		return "do not disturb"
	}

	return status
}

// SetStatusWithTimer sets a person's status on the server
func SetStatusWithTimer(context echo.Context) error {
	name := strings.ToLower(context.Param("name"))
	status := strings.ToLower(context.Param("status"))
	timeString := context.Param("time")
	timeAmount, _ := strconv.Atoi(timeString)

	statusMap[name] = slightlySneaky(status)

	msg := fmt.Sprintf("%s's status was set to: %s", strings.Title(name), status)

	updateEvent.Timestamp = time.Now()
	updateEvent.Key = "timer"
	updateEvent.Value = slightlySneaky(status)
	updateEvent.User = name
	updateEvent.Data = timeAmount

	provisioning.SocketManager().WriteToSockets(updateEvent)

	log.L.Debug(msg)

	return context.JSON(http.StatusOK, msg)
}

// SetAllStatus sets everyone's status to the same thing
func SetAllStatus(context echo.Context) error {
	status := strings.ToLower(context.Param("status"))

	for K := range statusMap {
		statusMap[K] = slightlySneaky(status)
	}

	msg := fmt.Sprintf("Everyone's status was set to: %s", status)

	updateEvent.Timestamp = time.Now()
	updateEvent.Key = "everyone"
	updateEvent.Value = slightlySneaky(status)

	provisioning.SocketManager().WriteToSockets(updateEvent)

	log.L.Debug(msg)

	return context.JSON(http.StatusOK, msg)
}

// GetStatus gets a person's status from the server
func GetStatus(context echo.Context) error {
	name := strings.ToLower(context.Param("name"))

	log.L.Debugf("Getting status of %s...", strings.Title(name))

	return context.JSON(http.StatusOK, statusMap[name])
}

// GetAllStatus returns the whole map of person states
func GetAllStatus(context echo.Context) error {
	log.L.Debugf("Getting status of everyone")

	return context.JSON(http.StatusOK, statusMap)
}
