# AutoPath Script Executor

<img src="./images/icon.png" alt="Extension Logo" width="300" height="300">


此擴充套件允許使用者透過右鍵點擊資料夾來選擇並執行 `package.json` 中定義的腳本。選定腳本後，擴充套件會自動將所在資料夾的相對路徑作為參數傳遞給腳本，便於在開發過程中快速且方便地執行與資料夾相關的腳本任務。

## 如何使用

1. 在 VSCode 的檔案總管中，右鍵點擊一個資料夾。
2. 選擇 `AutoPath Script Executor`。
3. 選擇執行的腳本。

## 設定

### 調整預設腳本路徑參數

預設的路徑參數名稱為 `path`，可在 `package.json` 新增 `autoPathScriptExecutor` 設定來自訂：

```json
{
  ...,
  "autoPathScriptExecutor": {
    "defaultParamName": "folderPath"
  }
}
```

### 只顯示特定腳本選項

```json
{
  ...,
  "autoPathScriptExecutor": {
    "scripts": ["script1", "script2", "script3"]
  }
}
```

### 可針對特定腳本，設定指定的路徑名稱

```json
{
    ...,
    "autoPathScriptExecutor": {
        "scripts": [
        "script1",
        {
            "script": "script2",
            "paramName": "folderPath",
        },
        {
            "script": "script3",
            "paramName": "dir",
        },
        ],
    }
}
```

### 示範影片
  
[VSCode 套件 - AutoPath Script Executor](https://www.youtube.com/watch?v=gGawwME1lMg)

## License

MIT
