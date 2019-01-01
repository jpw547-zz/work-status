package main

import (
	"net/http"

	"github.com/byuoitav/common"
	"github.com/byuoitav/common/log"
	"github.com/jpw547/work-status/handlers"
	"github.com/jpw547/work-status/provisioning"
	"github.com/jpw547/work-status/socket"
)

func main() {
	port := ":12300"
	router := common.NewRouter()

	// person status endpoints
	router.PUT("/status/persons/:name/state/:status", handlers.SetStatus)
	router.PUT("/status/persons/:name/state/:status/timer/:time", handlers.SetStatusWithTimer)
	router.GET("/status/persons/:name", handlers.GetStatus)
	router.GET("/status/all", handlers.GetAllStatus)
	router.PUT("/status/all/state/:status", handlers.SetAllStatus)

	// log level endpoints
	router.PUT("/log-level/:level", log.SetLogLevel)
	router.GET("/log-level", log.GetLogLevel)

	// provisioning endpoints
	router.GET("/provisioning/ws", socket.UpgradeToWebsocket(provisioning.SocketManager()))
	router.GET("/provisioning/id", handlers.GetProvisioningID)

	server := http.Server{
		Addr:           port,
		MaxHeaderBytes: 1024 * 10,
	}

	router.StartServer(&server)
}
