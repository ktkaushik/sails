<?php
/**
 * Description of crud
 *
 * @author mike
 */
class CRUD
{
	// Create empty cache
	private $cache = array();

	public function  __construct($options=null) {

		if (isset($options) && isset($options['url'])) {
			$this->url = $options['url'];

			// Immediately load the relevant content for this page
			$this->load();
		}
		else {
			throw new Exception (
				'No CRUD.io content cloud specified.' .
				'Please specify a "url" option in the SDK configuration.');
		}

		
	}


	/**
	 * Request a node from the content cloud.
	 *
	 * NOTE:
	 * This is a safe way of accessing the functionality of CRUD.get, since
	 * it prevents accessing nodes which were not already fetched on CRUD.io's
	 * initialization.
	 *
	 * @param <type> $node
	 * @param <type> $dontEcho
	 * @return <type>
	 */
	public function read($node, $dontEcho=false) {
		// Check cache first
		if (isset($this->cache[$node])) {
			$type = $this->cache[$node]['type'];
			$payload = $this->cache[$node]['payload'];
		}
		else {
			$type = 'text';
			$payload =
				"The node ('$node') was not loaded. ".
				"Make sure it is included in your CMS, ".
				"or force another load with crud.get.";
		}

		return $this->output($payload,$type,$dontEcho);
	}
	

	/**
	 * Request a node from the content cloud.
	 *
	 * WARNING:
	 * Make sure you're only accessing nodes which are included in this
	 * page, collection or layout.  Otherwise, this is an inefficient method
	 * of accessing data since you're hitting your content cloud for each
	 * payload.
	 *
	 * @param <type> $node
	 * @param <type> $dontEcho
	 * @return <type>
	 */
	public function get($node, $dontEcho=false) {
		
		// Check cache first
		if (isset($this->cache[$node])) {
			$type = $this->cache[$node]['type'];
			$payload = $this->cache[$node]['payload'];
		}
		else {
			// If the node isn't in the cache, request it from content cloud
			$readObject = $this->request('read',$node);

			if (!$readObject['success']) {
				// Handle errors
				$type = 'text';
				$payload = $readObject['error']['message'];
			}
			else {
				// Return requested node
				$type = $readObject['content'][$node][$type];
				$payload = $readObject['content'][$node][$payload];
			}
		}

		return $this->output($payload,$type,$dontEcho);
	}


	/**
	 * Called automatically during the initialization.
	 * Loads applicable nodes from the content cloud.
	 *
	 * @param <type> $node
	 * @param <type> $dontEcho
	 * @return <type>
	 */
	public function load($collection=null) {
		$loadObject = $this->request('load',$collection);

		if (!$loadObject['success']) {
			// Handle errors
			throw new Exception($loadObject['error']['message']);
		}
		else {
			// Update cache with any changes/new nodes
			$this->cache = array_merge($this->cache,$loadObject['content']);
		}
	}
	

	/**
	 * Make a request to the CRUD.io Cloud Server
	 */
	private function request($method, $parameter=null) {

		// Generate API URL from request
		// TODO: check if http(s) exists and delete if necessary
		// TODO: check if trailing slash exists on url and delete if necessary
		$url = $this->url . "/".$method."/" . $parameter;

		$file = fopen ($url, "r");
		if (!$file) {
			$response = $this->buildError("Unable to access content cloud.");
		}
		else {
			$buffer = "";
			while (!feof ($file)) {
				$buffer .= fgets ($file, 1024);
			}
			fclose($file);

			// Decode JSON response from server
			$response = json_decode($buffer,true);
			if (!$response) {
				$response = $this->buildError("Unable to parse content request.");
			}
		}
		
		// Return response object
		return $response;
	}



	/**
	 * Output payload differently depending on content-type and dontEcho flag
	 */
	private function output($payload,$type='text',$dontEcho=false) {

		// TODO: observe and respond to type
		// TODO: HTML escape or not
		// TODO: control image output
		// TODO: control embedded media output


		// Output or return $payload
		if ($dontEcho) {
			return $payload;
		}
		else {
			echo $payload;
		}
	}



	/**
	 * @param String $msg
	 * @return error object
	 */
	private function buildError($msg) {
		return array(
			'success' => false,
			'error' => array(
				'message' => $msg
			)
		);
	}
}
?>