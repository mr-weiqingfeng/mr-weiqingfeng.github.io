function FindProxyForURL(url, host) {
  // 代理服务器的主机名和端口号
  var proxyHost = "192.168.33.60";
  var proxyPort = "8888";
  // 使用代理服务器
  return "PROXY " + proxyHost + ":" + proxyPort;
}
