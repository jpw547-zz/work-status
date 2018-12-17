package main

import (
	"net/http"

	"github.com/byuoitav/common"
	"github.com/byuoitav/common/log"
	"github.com/jpw547/work-status/handlers"
)

func main() {
	port := ":12300"
	router := common.NewRouter()

	// person status endpoints
	router.PUT("/status/persons/:name/state/:status", handlers.SetStatus)
	router.GET("/status/persons/:name", handlers.GetStatus)
	router.GET("/status/all", handlers.GetAllStatus)

	// log level endpoints
	router.PUT("/log-level/:level", log.SetLogLevel)
	router.GET("/log-level", log.GetLogLevel)

	server := http.Server{
		Addr:           port,
		MaxHeaderBytes: 1024 * 10,
	}

	router.StartServer(&server)
}
